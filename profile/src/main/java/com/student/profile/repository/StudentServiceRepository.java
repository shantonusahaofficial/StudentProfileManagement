package com.student.profile.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.student.profile.model.Student;


@Repository
public interface StudentServiceRepository extends CrudRepository<Student, Long> {
	Student findByName(String name);
}
