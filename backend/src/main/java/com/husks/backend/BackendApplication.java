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

@EnableJpaAuditing
@SpringBootApplication
@EntityScan("com.husks.backend.entities")
@EnableJpaRepositories("com.husks.backend.repositories")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner createDefaultAdmin(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
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
					return;
				}

				System.out.println("📝 Creando usuario administrador por defecto...");
				
				// Crear usuario administrador por defecto
				Usuario adminUser = Usuario.builder()
						.nombre("Administrador")
						.email("admin@email.com")
						.password(passwordEncoder.encode("123456"))
						.rol(Rol.ADMIN)
						.imagenPerfilPublicId("user_img")
						.build();
				
				// El campo activo se hereda de Base y por defecto es true
				// Pero lo establecemos explícitamente para mayor claridad
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
				
			} catch (Exception e) {
				System.err.println("❌ Error al crear usuario administrador por defecto:");
				System.err.println("   - Error: " + e.getMessage());
				System.err.println("   - Tipo: " + e.getClass().getSimpleName());
				e.printStackTrace();
				
				// Intentar obtener más información sobre el error
				if (e.getCause() != null) {
					System.err.println("   - Causa: " + e.getCause().getMessage());
				}
			}
		};
	}
}


