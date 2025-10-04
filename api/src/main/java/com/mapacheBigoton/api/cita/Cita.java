package com.mapacheBigoton.api.cita;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mapacheBigoton.api.barbero.Barbero;
import com.mapacheBigoton.api.cliente.Cliente;
import com.mapacheBigoton.api.servicio.Servicio;
import com.mapacheBigoton.api.sucursal.Sucursal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "citas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCita;

    @Column(nullable = false, length = 45)
    private String fecha;

    @Column(nullable = false, length = 45)
    private String hora;

    @ManyToOne
    @JoinColumn(name = "idBarbero", nullable = false)
    private Barbero barbero;

    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "idServicio", nullable = false)
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "idSucursal", nullable = false)
    private Sucursal sucursal;
}