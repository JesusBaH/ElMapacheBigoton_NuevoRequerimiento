package com.mapacheBigoton.api.barbero;

import com.mapacheBigoton.api.sucursal.Sucursal;
import com.mapacheBigoton.api.sucursal.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/barberos")
public class BarberoController {

    @Autowired
    private BarberoRepository barberoRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @PostMapping("/sucursal/{idSucursal}")
    public ResponseEntity<Barbero> create(@PathVariable Integer idSucursal, @RequestBody Barbero barbero) {
        Optional<Sucursal> sucursalOptional = sucursalRepository.findById(idSucursal);

        if (sucursalOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Sucursal sucursal = sucursalOptional.get();
        barbero.setSucursal(sucursal);

        Barbero barberoGuardado = barberoRepository.save(barbero);
        return ResponseEntity.ok(barberoGuardado);
    }

    @GetMapping
    public ResponseEntity<Iterable<Barbero>> findAll() {
        return ResponseEntity.ok(barberoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Barbero> findById(@PathVariable Integer id) {
        Optional<Barbero> barbero = barberoRepository.findById(id);
        return barbero.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Barbero> update(@PathVariable Integer id, @RequestBody Barbero barbero) {
        if (!barberoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        barbero.setIdBarbero(id);
        return ResponseEntity.ok(barberoRepository.save(barbero));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!barberoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        barberoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sucursal/{idSucursal}")
    public ResponseEntity<List<Barbero>> findBySucursal(@PathVariable Integer idSucursal) {
        return ResponseEntity.ok(barberoRepository.findBySucursal_IdSucursal(idSucursal));
    }
}