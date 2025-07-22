package com.husks.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.husks.backend.entities.Usuario;
import com.husks.backend.enums.Rol;
import com.husks.backend.repositories.UsuarioRepository;
import java.util.Optional;
import com.husks.backend.entities.Direccion;
import com.husks.backend.repositories.DireccionRepository;
import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.repositories.UsuarioDireccionRepository;
import com.husks.backend.entities.Talle;
import com.husks.backend.enums.SistemaTalle;
import com.husks.backend.repositories.TalleRepository;
import com.husks.backend.entities.Categoria;
import com.husks.backend.repositories.CategoriaRepository;
import com.husks.backend.entities.Tipo;
import com.husks.backend.repositories.TipoRepository;
import com.husks.backend.entities.Producto;
import com.husks.backend.repositories.ProductoRepository;

@EnableJpaAuditing
@SpringBootApplication
@EntityScan("com.husks.backend.entities")
@EnableJpaRepositories("com.husks.backend.repositories")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner createDefaultAdmin(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
												 DireccionRepository direccionRepository, UsuarioDireccionRepository usuarioDireccionRepository,
												 TalleRepository talleRepository, CategoriaRepository categoriaRepository, TipoRepository tipoRepository, ProductoRepository productoRepository) {
		return args -> {
			System.out.println("🚀 Iniciando creación de usuario administrador por defecto...");
			try {
				// Verificar si ya existe un usuario admin con ese email
				Optional<Usuario> existingAdmin = usuarioRepository.findByEmail("admin@email.com");
				if (existingAdmin.isPresent()) {
					Usuario admin = existingAdmin.get();
					System.out.println("✅ Usuario administrador por defecto ya existe:");
					System.out.println("   - ID: " + admin.getId());
					System.out.println("   - Email: " + admin.getEmail());
					System.out.println("   - Rol: " + admin.getRol());
					System.out.println("   - Activo: " + admin.isActivo());
				} else {
					System.out.println("📝 Creando usuario administrador por defecto...");
					Usuario adminUser = Usuario.builder()
						.nombre("Administrador")
						.email("admin@email.com")
						.password(passwordEncoder.encode("123456"))
						.rol(Rol.ADMIN)
						.imagenPerfilPublicId("user_img")
						.build();
					adminUser.setActivo(true);
					Usuario savedAdmin = usuarioRepository.save(adminUser);
					System.out.println("✅ Usuario administrador creado exitosamente:");
					System.out.println("   - ID: " + savedAdmin.getId());
					System.out.println("   - Nombre: " + savedAdmin.getNombre());
					System.out.println("   - Email: " + savedAdmin.getEmail());
					System.out.println("   - Rol: " + savedAdmin.getRol());
					System.out.println("   - Activo: " + savedAdmin.isActivo());
					System.out.println("   - Imagen: " + savedAdmin.getImagenPerfilPublicId());
					System.out.println("🔑 Credenciales de acceso:");
					System.out.println("   - Email: admin@email.com");
					System.out.println("   - Password: 123456");
				}

				// === USUARIO CLIENTE LUIS ===
				System.out.println("🚀 Iniciando creación de usuario cliente por defecto (Luis)...");
				Usuario luisUser = Usuario.builder()
					.nombre("Luis")
					.email("luis@email.com")
					.password(passwordEncoder.encode("123456"))
					.rol(Rol.CLIENTE)
					.imagenPerfilPublicId("user_img")
					.build();
				luisUser.setActivo(true);
				Usuario savedLuis = usuarioRepository.save(luisUser);
				System.out.println("✅ Usuario cliente creado exitosamente:");
				System.out.println("   - ID: " + savedLuis.getId());
				System.out.println("   - Nombre: " + savedLuis.getNombre());
				System.out.println("   - Email: " + savedLuis.getEmail());
				System.out.println("   - Rol: " + savedLuis.getRol());
				System.out.println("   - Activo: " + savedLuis.isActivo());

				// Crear dirección
				Direccion direccionLuis = Direccion.builder()
					.calle("Los tilos")
					.localidad("6ta seccion")
					.cp("5501")
					.build();
				Direccion savedDireccion = direccionRepository.save(direccionLuis);
				System.out.println("✅ Dirección creada para Luis:");
				System.out.println("   - ID: " + savedDireccion.getId());
				System.out.println("   - Calle: " + savedDireccion.getCalle());
				System.out.println("   - Localidad: " + savedDireccion.getLocalidad());
				System.out.println("   - CP: " + savedDireccion.getCp());

				// Relacionar usuario y dirección
				UsuarioDireccion usuarioDireccion = UsuarioDireccion.builder()
					.usuario(savedLuis)
					.direccion(savedDireccion)
					.build();
				usuarioDireccion.setActivo(true);
				UsuarioDireccion savedUsuarioDireccion = usuarioDireccionRepository.save(usuarioDireccion);
				System.out.println("✅ Relación usuario-dirección creada para Luis:");
				System.out.println("   - ID: " + savedUsuarioDireccion.getId());
				System.out.println("   - Usuario: " + savedUsuarioDireccion.getUsuario().getNombre());
				System.out.println("   - Dirección: " + savedUsuarioDireccion.getDireccion().getCalle() + ", " + savedUsuarioDireccion.getDireccion().getLocalidad() + " (" + savedUsuarioDireccion.getDireccion().getCp() + ")");

				// === TALLE ===
				Talle talleAmericano = Talle.builder()
					.sistema(SistemaTalle.americano)
					.valor("40")
					.build();
				Talle talleEuropeo = Talle.builder()
					.sistema(SistemaTalle.europeo)
					.valor("M")
					.build();
				Talle savedTalleAmericano = talleRepository.save(talleAmericano);
				Talle savedTalleEuropeo = talleRepository.save(talleEuropeo);
				System.out.println("✅ Talles creados: Americano 40, Europeo M");

				// === CATEGORÍAS ===
				Categoria categoriaHombre = Categoria.builder().nombre("Hombre").tipos(new java.util.ArrayList<>()).build();
				Categoria categoriaMujer = Categoria.builder().nombre("Mujer").tipos(new java.util.ArrayList<>()).build();
				Categoria savedCategoriaHombre = categoriaRepository.save(categoriaHombre);
				Categoria savedCategoriaMujer = categoriaRepository.save(categoriaMujer);
				System.out.println("✅ Categorías creadas: Hombre, Mujer");

				// === TIPOS ===
				Tipo tipoPantalon = Tipo.builder().nombre("Pantalón").categorias(new java.util.ArrayList<>()).build();
				Tipo tipoBuzo = Tipo.builder().nombre("Buzo").categorias(new java.util.ArrayList<>()).build();
				Tipo savedTipoPantalon = tipoRepository.save(tipoPantalon);
				Tipo savedTipoBuzo = tipoRepository.save(tipoBuzo);
				System.out.println("✅ Tipos creados: Pantalón, Buzo");

				// === VINCULAR TIPOS Y CATEGORÍAS ===
				savedCategoriaHombre.getTipos().add(savedTipoPantalon);
				savedCategoriaHombre.getTipos().add(savedTipoBuzo);
				savedCategoriaMujer.getTipos().add(savedTipoPantalon);
				savedCategoriaMujer.getTipos().add(savedTipoBuzo);
				categoriaRepository.save(savedCategoriaHombre);
				categoriaRepository.save(savedCategoriaMujer);
				savedTipoPantalon.getCategorias().add(savedCategoriaHombre);
				savedTipoPantalon.getCategorias().add(savedCategoriaMujer);
				savedTipoBuzo.getCategorias().add(savedCategoriaHombre);
				savedTipoBuzo.getCategorias().add(savedCategoriaMujer);
				tipoRepository.save(savedTipoPantalon);
				tipoRepository.save(savedTipoBuzo);
				System.out.println("✅ Tipos y categorías vinculados");

				// === PRODUCTO POR DEFECTO ===
				Producto producto = Producto.builder()
					.nombre("Pantalón clásico")
					.descripcion("Pantalón de jean azul clásico, cómodo y resistente.")
					.precio(new java.math.BigDecimal("7999.99"))
					.cantidad(20)
					.color("Azul")
					.categoria(savedCategoriaHombre)
					.tipo(savedTipoPantalon)
					.imagenPublicId("no_cloth.jpeg")
					.tallesDisponibles(new java.util.HashSet<>())
					.build();
				producto.setActivo(true); // <-- Asegura que el producto esté activo
				producto.getTallesDisponibles().add(savedTalleAmericano);
				Producto savedProducto = productoRepository.save(producto);
				System.out.println("✅ Producto por defecto creado: Pantalón clásico");

			} catch (Exception e) {
				System.err.println("❌ Error al crear datos por defecto:");
				System.err.println("   - Error: " + e.getMessage());
				System.err.println("   - Tipo: " + e.getClass().getSimpleName());
				e.printStackTrace();
				if (e.getCause() != null) {
					System.err.println("   - Causa: " + e.getCause().getMessage());
				}
			}
		};
	}
}


