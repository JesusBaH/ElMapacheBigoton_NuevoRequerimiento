package com.mapacheBigoton.api.sucursal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mapacheBigoton.api.barbero.Barbero;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "sucursal")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSucursal;

    @Column(nullable = false, length = 200)
    private String direccion;

    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Barbero> barberos;
}