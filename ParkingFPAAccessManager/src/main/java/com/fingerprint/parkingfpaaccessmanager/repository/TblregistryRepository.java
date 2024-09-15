package com.fingerprint.parkingfpaaccessmanager.repository;

import com.fingerprint.parkingfpaaccessmanager.model.entity.Tblregistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TblregistryRepository extends JpaRepository<Tblregistry, Long> {

    Tblregistry findTblregistryByCvereg(long cvereg);

    @Query(value = "SELECT t.* FROM tblregistry t " +
            "WHERE t.cveest = :cveest ", nativeQuery = true)
    Tblregistry findTblregistryBycveest(@Param("cveest") long cveest);
}
