-- TODO: Equipo Back SQL - crear el schema aqui
-- -----------------------------------------------------
-- Schema tareas
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS tareas;
CREATE SCHEMA tareas;
USE tareas;

-- Ver issues en GitHub para las tareas asignadas

-- -----------------------------------------------------
-- Table `tareas`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tareas`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `createAt` DATETIME(1) NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME(1) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB;

-- Tabla tareas: crear aqui
-- -----------------------------------------------------
-- Table `tareas`.`tareas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tareas`.`tareas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `completada` TINYINT NULL DEFAULT 0,
  `users_id` INT NOT NULL,
  `createdAt` DATETIME(1) NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tareas_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `jwk`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
