		package com.husks.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import com.fasterxml.jackson.databind.ObjectMapper;


import org.springframework.context.annotation.Bean;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

@EnableJpaAuditing
@SpringBootApplication
@EntityScan("com.husks.backend.entities")
@EnableJpaRepositories("com.husks.backend.repositories")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}


