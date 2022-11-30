package com.student.profile.serviceImpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.student.profile.help.ResponseEntity;
import com.student.profile.model.Student;
import com.student.profile.repository.StudentServiceRepository;
import com.student.profile.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService {
	

	@Autowired
	private StudentServiceRepository studentRepo;

	@Override
	public ResponseEntity saveStudent(Student student) {
		ResponseEntity response = new ResponseEntity();
		int count = 0;

		if (student.getUpdateId() != null) {
			count++;
			student.setId(student.getUpdateId());
		}
		try {

			if (count > 0) {
				studentRepo.save(student);
				response.setMsg("Update Record Successfully!!");
				response.setMsgCode("200");
			} else {
	
				Student checkName = studentRepo.findByName(student.getName());
				
				if (checkName != null) {
					response.setMsg("Student name alredy exist!!");
					response.setMsgCode("300");
				} else {
					studentRepo.save(student);
					response.setMsg("Add Record Successfully!!");
					response.setMsgCode("200");
				}
			}

		} catch (Exception ex) {
			response.setMsg("Exception Occour!!");
			response.setMsgCode("500");
		}
		return response;
	}

	@Override
	public List<Student> listOfStudent() {
		return (List<Student>) studentRepo.findAll();
	}

	@Override
	public ResponseEntity deleteStudent(Long id) {
		ResponseEntity response = new ResponseEntity();
		try {
			studentRepo.deleteById(id);
			response.setMsg("Student Information Delete Successfully!!");
			response.setMsgCode("200");
		} catch (Exception ex) {
			response.setMsg("Exception Occour");
			response.setMsgCode("500");
		}
		return response;
	}

}
