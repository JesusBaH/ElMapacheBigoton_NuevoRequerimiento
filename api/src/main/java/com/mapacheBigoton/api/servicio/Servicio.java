package com.mapacheBigoton.api.servicio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mapacheBigoton.api.cita.Cita;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "servicio")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idServicio;

    @Column(nullable = false, length = 200)
    private String descripcion;

    @Column(nullable = false)
    private Double costo;

    @OneToMany(mappedBy = "servicio")
    @JsonIgnore
    private List<Cita> citas;
}