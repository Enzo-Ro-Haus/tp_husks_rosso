import style from './CartButton.module.css'

interface CartButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      className={`btn btn-success w-100 mt-2 ${style.buttonNewProduct}`}
      onClick={onClick}
      disabled={disabled}
    >
      Buy
    </button>
  );
}
