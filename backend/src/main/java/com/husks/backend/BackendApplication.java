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
												 DireccionRepository direccionRepository, UsuarioDireccionRepository usuarioDireccionRepository) {
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

			} catch (Exception e) {
				System.err.println("❌ Error al crear usuario administrador o cliente por defecto:");
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


