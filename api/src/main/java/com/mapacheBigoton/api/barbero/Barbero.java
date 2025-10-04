package com.mapacheBigoton.api.barbero;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mapacheBigoton.api.cita.Cita;
import com.mapacheBigoton.api.sucursal.Sucursal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "barbero")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    private Sucursal sucursal;
}