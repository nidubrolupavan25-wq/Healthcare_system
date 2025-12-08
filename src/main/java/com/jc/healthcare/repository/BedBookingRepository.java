package com.jc.healthcare.repository;

import com.jc.healthcare.model.BedBooking;
import com.jc.healthcare.model.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BedBookingRepository extends JpaRepository<BedBooking, Long> {

    List<BedBooking> findByWard(Ward ward);

    @Query("SELECT COUNT(b) FROM BedBooking b WHERE b.ward.wardId = :wardId AND b.status = 'Active'")
    long countBookedBedsByWard(@Param("wardId") Long wardId);

    @Query("SELECT COUNT(b) FROM BedBooking b WHERE b.ward.wardId = :wardId AND b.status = 'Available'")
    long countAvailableBedsByWard(@Param("wardId") Long wardId);

    @Query("SELECT COUNT(b) FROM BedBooking b WHERE b.ward.wardId = :wardId")
    long countTotalBedsByWard(@Param("wardId") Long wardId);

    @Query("SELECT b FROM BedBooking b WHERE b.bedId = :bedId AND b.ward.wardId = :wardId AND b.status = 'Available'")
    List<BedBooking> findAvailableBedByBedAndWard(@Param("bedId") Long bedId, @Param("wardId") Long wardId);

    @Query("SELECT b FROM BedBooking b WHERE b.bedId = :bedId AND b.ward.wardId = :wardId AND b.status = 'Active'")
    List<BedBooking> findActiveBookingByBedAndWard(@Param("bedId") Long bedId, @Param("wardId") Long wardId);
    @Query("SELECT b FROM BedBooking b WHERE b.bedId = :bedId AND b.ward.wardId = :wardId")
    List<BedBooking> findByBedIdAndWardId(@Param("bedId") Long bedId, @Param("wardId") Long wardId);
}