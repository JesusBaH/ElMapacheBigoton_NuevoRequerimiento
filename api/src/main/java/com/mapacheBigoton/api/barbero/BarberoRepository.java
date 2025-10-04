package com.mapacheBigoton.api.barbero;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarberoRepository extends CrudRepository<Barbero, Integer> {
    List<Barbero> findBySucursal_IdSucursal(Integer idSucursal);
}