import React, { useState, useMemo } from 'react';
import { ICategoria } from '../../../../types/ICategoria';
import { IDetalle } from '../../../../types/IDetalle';
import { IDireccion } from '../../../../types/IDireccion';
import { ITalle } from '../../../../types/ITalle';
import { EditButton } from '../../Buttons/EditButton/EditButton';
import style from './ListCard.module.css';
import { DeleteButton } from '../../Buttons/DeleteButton/DeleteButton';

type ListCardProps = {
  variant:
    | 'Products'
    | 'Users'
    | 'Categories'
    | 'Types'
    | 'Sizes'
    | 'Addresses'
    | 'Orders'
    | 'Client';
  id: number | string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  sizes?: ITalle[];
  email?: string;
  rol?: string;
  address?: IDireccion[];
  type?: ICategoria;
  category?: ICategoria[];
  system?: string;
  value?: string;
  street?: string;
  locality?: string;
  pc?: number;
  detail?: IDetalle[];
  date?: Date | string;
  total?: number;
  payMethod?: string;
  Dstatus?: string;
};

export const ListCard: React.FC<ListCardProps> = props => {
  const [showEdit, setShowEdit] = useState(false);
  const {
    variant,
    id,
    name,
    description,
    price,
    quantity,
    sizes,
    email,
    rol,
    address,
    type,
    category,
    system,
    value,
    street,
    locality,
    pc,
    detail,
    date,
    total,
    payMethod,
    Dstatus,
  } = props;
  const handleClose = () => setShowEdit(false);

  // Normalizar date a instancia de Date
  const dateObj = useMemo<Date | undefined>(() => {
    if (date == null) return undefined;
    return date instanceof Date ? date : new Date(date);
  }, [date]);

  // Construir initialData basado en variant
  const initialData: any = { id };
  switch (variant) {
    case 'Products':
      Object.assign(initialData, {
        nombre: name,
        descripcion: description,
        precio: price,
        cantidad: quantity,
        talles: sizes?.map(s => s.valor) || [],
        categoria: type,
      });
      break;
    case 'Users':
    case 'Client':
      Object.assign(initialData, {
        nombre: name,
        email,
        rol,
        direcciones: address,
      });
      break;
    case 'Categories':
      Object.assign(initialData, {
        nombre: name,
        tipo: type,
      });
      break;
    case 'Types':
      Object.assign(initialData, {
        nombre: name,
        categorias: category,
      });
      break;
    case 'Sizes':
      Object.assign(initialData, {
        sistema: system,
        valor: value,
      });
      break;
    case 'Addresses':
      Object.assign(initialData, {
        calle: street,
        localidad: locality,
        cp: pc,
      });
      break;
    case 'Orders':
      Object.assign(initialData, {
        direccion: street,
        detalle: detail,
        fecha: dateObj ? dateObj.toISOString().split('T')[0] : undefined,
        total,
        metodoPago: payMethod,
        estado: Dstatus,
      });
      break;
    default:
      break;
  }

  const onEdited = () => {
    // TODO: Refresh list after edit
  };

  const renderContent = () => {
    switch (variant) {
      case 'Products':
        return (
          <>
            <img
              className={style.listCardImg}
              src="/src/assets/landings/image.png"
              alt={name}
            />
            <div className={style.ClotheDetail}>
              <p><b>ID:</b> {id}</p>
              <p><b>Name:</b> {name}</p>
              <p><b>Description:</b> {description}</p>
              {sizes && <p><b>Sizes:</b> {sizes.map(s => s.valor).join(', ')}</p>}
              <p><b>Price:</b> ${price}</p>
              <p><b>Stock:</b> {quantity}</p>
            </div>
          </>
        );
      case 'Users':
      case 'Client':
        return (
          <>
            <img
              className={style.listCardImgUsuario}
              src="/src/assets/user_img.jpg"
              alt={name}
            />
            <div>
              <p><b>ID:</b> {id}</p>
              <p><b>Name:</b> {name}</p>
              <p><b>Email:</b> {email}</p>
              <p><b>Role:</b> {rol}</p>
              {address?.map(d => (
                <p key={d.id}>{d.calle}, {d.localidad}, {d.cp}</p>
              ))}
            </div>
          </>
        );
      case 'Categories':
        return (
          <>
            <p><b>ID:</b> {id}</p>
            <p><b>Name:</b> {name}</p>
            <p><b>Type:</b> {type?.nombre}</p>
          </>
        );
      case 'Types':
        return (
          <>
            <p><b>ID:</b> {id}</p>
            <p><b>Name:</b> {name}</p>
            {category?.map(c => <p key={c.id}>{c.nombre}</p>)}
          </>
        );
      case 'Sizes':
        return (
          <>
            <p><b>ID:</b> {id}</p>
            <p><b>System:</b> {system}</p>
            <p><b>Value:</b> {value}</p>
          </>
        );
      case 'Addresses':
        return (
          <>
            <p><b>ID:</b> {id}</p>
            <p><b>Street:</b> {street}</p>
            <p><b>Locality:</b> {locality}</p>
            <p><b>Postal Code:</b> {pc}</p>
          </>
        );
      case 'Orders':
        return (
          <>
            <p><b>ID:</b> {id}</p>
            <p><b>Detail:</b> {detail?.map(d => `${d.cantidad} x ${d.id}`).join(', ')}</p>
            <p><b>Date:</b> {dateObj ? dateObj.toLocaleDateString() : 'Fecha no disponible'}</p>
            <p><b>Total:</b> {total}</p>
            <p><b>Payment method:</b> {payMethod}</p>
            <p><b>Status:</b> {Dstatus}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={style.containerPrincipalListCard}>
      <div className={style.ListCard}>
        <div className={style.ClotheInfo}>{renderContent()}</div>
        <div className={style.Botones}>
          <EditButton
            view={variant}
            initialData={initialData}
            onClose={handleClose}
            onEdited={onEdited}
          />
          <DeleteButton view={variant} id={id} onDeleted={onEdited} />
        </div>
      </div>
      {showEdit && (
        <EditButton
          view={variant}
          initialData={initialData}
          onClose={handleClose}
          onEdited={onEdited}
        />
      )}
    </div>
  );
};
