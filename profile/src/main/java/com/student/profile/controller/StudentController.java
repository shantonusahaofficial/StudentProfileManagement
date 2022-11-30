package com.student.profile.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.student.profile.help.ResponseEntity;
import com.student.profile.model.Student;
import com.student.profile.service.StudentService;

@RequestMapping("/api/v1/")
@RestController
public class StudentController {

	@Autowired
	private StudentService studentService;

	@GetMapping("students")
	public List<Student> getLoanDetails() {
		return studentService.listOfStudent();
	}

	@PostMapping("save")
	public ResponseEntity saveStudent(@RequestBody Student student) {
		return studentService.saveStudent(student);
	}

	@PostMapping("update")
	public ResponseEntity saveUpdate(@RequestBody Student student) {
		return studentService.saveStudent(student);
	}

	@PostMapping("delete")
	public ResponseEntity deleteStudent(@RequestParam Long id) {
		return studentService.deleteStudent(id);
	}

}
