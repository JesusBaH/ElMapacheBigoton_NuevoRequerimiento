package com.mapacheBigoton.api.sucursal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mapacheBigoton.api.barbero.Barbero;
import com.mapacheBigoton.api.cita.Cita;
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
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSucursal;

    @Column(nullable = false, length = 200)
    private String direccion;


    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private List<Barbero> barberos;



}