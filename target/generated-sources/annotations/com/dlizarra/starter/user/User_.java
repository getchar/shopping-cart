package com.dlizarra.starter.user;

import com.dlizarra.starter.role.Role;
import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ {

	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, LocalDateTime> creationTime;
	public static volatile SingularAttribute<User, LocalDateTime> modificationTime;
	public static volatile SetAttribute<User, Role> roles;
	public static volatile SingularAttribute<User, Integer> id;
	public static volatile SingularAttribute<User, Boolean> enabled;
	public static volatile SingularAttribute<User, String> username;

}

