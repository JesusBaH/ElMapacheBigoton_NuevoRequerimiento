package com.mapacheBigoton.api.sucursal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/sucursales")
public class SucursalController {


    @Autowired
    private SucursalRepository sucursalRepository;


    @GetMapping
    public ResponseEntity<Iterable<Sucursal>> findAll() {
        return ResponseEntity.ok(sucursalRepository.findAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> findById(@PathVariable Integer id) {
        Optional<Sucursal> sucursal = sucursalRepository.findById(id);
        return sucursal.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<Sucursal> create(@RequestBody Sucursal sucursal) {
        return ResponseEntity.ok(sucursalRepository.save(sucursal));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> update(@PathVariable Integer id, @RequestBody Sucursal sucursal) {
        if (!sucursalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sucursal.setIdSucursal(id);
        return ResponseEntity.ok(sucursalRepository.save(sucursal));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!sucursalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sucursalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
