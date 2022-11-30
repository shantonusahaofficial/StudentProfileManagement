***Problem# 1:
This project has been done by using java jdk 8.
spring boot,JPA,MySQL,bootstarp,jqury,and javascript.


***Problem# 2:Write a regular expression to extract required
information from some provided URLs.

Answer:

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FirstInit {
	public static void main(String args[]) {
		String input_string = "abcd.com/y3ou453rname-3/profile-info/imasges-1/simple-image-gft.jpg";
		Pattern p = Pattern.compile(".com/");
		Matcher m = p.matcher(input_string);
		if (m.find()) {
			System.out.println(input_string.substring(m.end(), input_string.length()));
		}
	}
}
