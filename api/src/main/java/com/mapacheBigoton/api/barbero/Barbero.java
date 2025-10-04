package com.mapacheBigoton.api.barbero;
import com.mapacheBigoton.api.cita.Cita;
import com.mapacheBigoton.api.sucursal.Sucursal;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "barbero")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Barbero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBarbero;

    @Column(nullable = false, length = 200)
    private String nombre;

    @OneToMany(mappedBy = "barbero")
    @JsonIgnore
    private List<Cita> citas;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSucursal")
    @JsonIgnore
    private Sucursal sucursal;
}