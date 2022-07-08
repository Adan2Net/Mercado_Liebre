CREATE TABLE roles (id INT NOT NULL AUTO_INCREMENT, description varchar(45), primary key(id));
CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT, name varchar(45), email varchar(45) unique, password varchar(100), id_roles INT, primary key(id), foreign key(id_roles) references roles(id));
CREATE TABLE carts (id INT NOT NULL AUTO_INCREMENT, status varchar(45), id_users INT, primary key(id), foreign key(id_users) references users(id));
CREATE TABLE products (id INT NOT NULL AUTO_INCREMENT, name varchar(45), image varchar(45), price varchar(45), discount INT, id_carts INT, id_users INT, primary key(id), foreign key(id_carts) references carts(id), foreign key(id_users) references users(id)); 
