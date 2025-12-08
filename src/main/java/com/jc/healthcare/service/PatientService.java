package com.jc.healthcare.service;

import com.jc.healthcare.model.Patient;
import com.jc.healthcare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public long Count() {
        return patientRepository.getPatientCount();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id).map(patient -> {
            patient.setName(updatedPatient.getName());
            patient.setGender(updatedPatient.getGender());
            patient.setAadhar(updatedPatient.getAadhar());
            patient.setPhone(updatedPatient.getPhone());
            patient.setDateOfBirth(updatedPatient.getDateOfBirth());
            patient.setAddress(updatedPatient.getAddress());
            patient.setDoctorId(updatedPatient.getDoctorId());
            patient.setAppointmentDate(updatedPatient.getAppointmentDate());
            patient.setAppointmentTime(updatedPatient.getAppointmentTime());

            patient.setDosageInstructions(updatedPatient.getDosageInstructions());
            patient.setGeneratedAt(updatedPatient.getGeneratedAt());
            patient.setNotes(updatedPatient.getNotes());
            patient.setSelectedMedicines(updatedPatient.getSelectedMedicines());
            patient.setDateIssued(updatedPatient.getDateIssued());
            patient.setMedication(updatedPatient.getMedication());
            patient.setSelectedTests(updatedPatient.getSelectedTests());
            patient.setMedisionStatus(updatedPatient.getMedisionStatus());
            patient.setDoctorStatus(updatedPatient.getDoctorStatus());
            patient.setLabStatus(updatedPatient.getLabStatus());
            return patientRepository.save(patient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    public List<Patient> getByMedisionStatus(String status) {
        return patientRepository.findByMedisionStatusIgnoreCase(status);
    }

    public List<Patient> getByDoctorStatus(String status) {
        return patientRepository.findByDoctorStatusIgnoreCase(status);
    }

    public List<Patient> getByLabStatus(String status) {
        return patientRepository.findByLabStatusIgnoreCase(status);
    }

    // ✅ Filter Patients by Date Range + Status
    public List<Patient> getFilteredPatientsNative(String fromDate, String medisionStatus, String doctorStatus, Long doctorId) {
        try {
            return patientRepository.findPatientsByStatusAndDateNative(fromDate, medisionStatus, doctorStatus, doctorId);
        } catch (Exception e) {
            throw new RuntimeException("❌ Error while fetching data: " + e.getMessage());
        }
    }
    
   

    public Map<String, Object> getFullPatientDetails(Long patientId) {
        List<Object[]> result = patientRepository.getFullPatientDetails(patientId);

        if (result.isEmpty()) {
            throw new RuntimeException("No details found for patient ID: " + patientId);
        }

        Object[] row = result.get(0);
        Map<String, Object> data = new HashMap<>();

        // 🧍 Patient Details
        Map<String, Object> patient = new HashMap<>();
        patient.put("patientId", row[0]);
        patient.put("name", row[1]);
        patient.put("gender", row[2]);
        patient.put("disease", row[3]);
        patient.put("phone", row[4]);
        patient.put("address", row[5]);
        patient.put("doctorStatus", row[6]);
        patient.put("medisionStatus", row[7]);
        patient.put("labStatus", row[8]);

        // 🛏️ Bed Booking Details
        Map<String, Object> bedBooking = new HashMap<>();
        bedBooking.put("bookingId", row[9]);
        bedBooking.put("bedId", row[10]);
        bedBooking.put("admissionDate", row[11]);
        bedBooking.put("dischargeDate", row[12]);
        bedBooking.put("status", row[13]);

        // 🏥 Ward Details
        Map<String, Object> ward = new HashMap<>();
        ward.put("wardId", row[14]);
        ward.put("wardName", row[15]);
        ward.put("wardType", row[16]);
        ward.put("totalBeds", row[17]);
        ward.put("createdOn", row[18]);

        data.put("patient", patient);
        data.put("bedBooking", bedBooking);
        data.put("ward", ward);

        return data;
    }
    
    public Patient partialUpdatePatient(Long id, Map<String, Object> updates) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));

        // 🧠 Dynamically update fields
        updates.forEach((key, value) -> {
            switch (key) {
                case "name":
                    patient.setName((String) value);
                    break;
                case "gender":
                    patient.setGender((String) value);
                    break;
                case "aadhar":
                    patient.setAadhar((String) value);
                    break;
                case "phone":
                    patient.setPhone((String) value);
                    break;
                case "address":
                    patient.setAddress((String) value);
                    break;
                case "disease":
                    patient.setDisease((String) value);
                    break;
                case "doctorId":
                    patient.setDoctorId(Long.valueOf(value.toString()));
                    break;
                case "doctorStatus":
                    patient.setDoctorStatus((String) value);
                    break;
                case "labStatus":
                    patient.setLabStatus((String) value);
                    break;
                case "medisionStatus":
                    patient.setMedisionStatus((String) value);
                    break;
                case "dosageInstructions":
                    patient.setDosageInstructions((String) value);
                    break;
                case "notes":
                    patient.setNotes((String) value);
                    break;
                case "selectedMedicines":
                    patient.setSelectedMedicines((String) value);
                    break;
                case "selectedTests":
                    patient.setSelectedTests((String) value);
                    break;
                case "appointmentDate":
                    patient.setAppointmentDate((String) value);
                    break;
                case "appointmentTime":
                    patient.setAppointmentTime((String) value);
                    break;
               
                default:
                    System.out.println("⚠️ Unknown field ignored: " + key);
            }
        });

        return patientRepository.save(patient);
    }



}
