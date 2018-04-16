-- MySQL dump 10.13  Distrib 5.6.17, for Win64 (x86_64)
--
-- Host: r42ii9gualwp7i1y.chr7pe7iynqr.eu-west-1.rds.amazonaws.com    Database: yr3yzb75mbcq6uyw
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(25) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(80) NOT NULL,
  `reset_password_expires` varchar(45) NOT NULL,
  `reset_password_token` varchar(50) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `sign_up_date` varchar(45) NOT NULL,
  `last_login` varchar(45) NOT NULL,
  `pendiente` tinyint(1) NOT NULL DEFAULT '0',
  `bloqueado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'alumno1@email.com','alumno','1','$2a$08$9jA9EcS99LWyB.uy4REtQ.3qoN97LP3TyfRnwfSwG/P.wnog0L/F6','','',1,'2018-03-21T18:22:46+00:00','2018-03-21T18:46:50+00:00',0,0),(10,'hectoram@gmail.com','Héctor','Alonso Meana','$2a$08$ZyMgkTzm3uy4ck.W6HRKdeq1P2iG2C4w/NHKpqp8y2bn2oJB9L1/u','','',2,'0000-00-00','2018-03-21T18:12:53+00:00',0,1),(11,'msuarez1@gmail.com','Monica','Suarez','$2a$08$dZucMXFelSPBcMXexPsareFmn28gh55jzQbaCI4lcGTPGBe3eyxiS','0000-00-00','',2,'0000-00-00','0000-00-00',0,0),(14,'admin@gmail.com','admin','admin','$2a$08$9bj1Hfrvwv38uXoKkw/PVuLFY6HtbLOm1CKs81kFeMUYqihq913Ji','0000-00-00','',1,'0000-00-00','0000-00-00',1,0),(16,'clara@gmail.com','Clara','Alonso Suarez','$2a$08$GFBkZB61FqIKqLA5kz3enuH023cZQum8s/j.PRfkKAcYP2x0nwSte','','',5,'0000-00-00','2018-03-26T07:55:05+00:00',0,0),(17,'simon.pickin@fdi.ucm.es','Simon','Pickin','$2a$08$Y9mr/ucj7ia5SxfJ4mfRbu1ZvycreiMNn22UnT.Dcwy0Zbzw9SJgC','','',1,'2018-03-06T16:43:53+00:00','2018-04-06T16:19:10+00:00',0,0),(18,'amanja@dia.uned.es','Angeles','Manjarrés Riesco','$2a$08$eiDteHHUpPcN7PGB8U8Gi.p8AKoki.oG3UC40.JwKOiQy2wwwS.7i','','',1,'2018-03-06T16:44:35+00:00','2018-03-07T11:03:27+00:00',0,0),(19,'alumno2@email.com','Alumno','2','$2a$08$ZaE9hAYwG5xlVlxZAE9uEeMDVXNSlAUW7PNIWc4WI8Ca8AMrIltLW','','',1,'2018-03-21T18:35:51+00:00','2018-03-21T18:35:51+00:00',0,0),(20,'alumno3@email.com','Alumno','3','$2a$08$UGglWqeH6OYuWiZgjBBnCu.Xx.tzyR758lBWT14gFxyxVCbbLFbmm','','',1,'2018-03-21T18:36:38+00:00','2018-03-21T18:36:38+00:00',0,0),(21,'alumno4@email.com','alumno','4','$2a$08$zu.krhkudHIPCYc78MmMbOmHmjnYRddXFsTLCeDW08LBcD7BeQwG.','','',1,'2018-03-21T18:37:11+00:00','2018-03-21T18:37:11+00:00',0,0),(22,'alumno5@email.com','alumno','5','$2a$08$cGjoiMN.U2966tgNLr8I..NbdCvQmK3V9dQlwA64mwkCT7aM1wK1.','','',1,'2018-03-21T18:37:36+00:00','2018-03-21T18:37:36+00:00',0,0),(23,'entidad1@email.com','Entidad demandante','1','$2a$08$VxSNiabMIfxCkefq4Ao5zeB59yAe9175zLAkyTDNYNykC0SAp5q9i','','',2,'2018-03-21T18:38:22+00:00','2018-03-22T09:52:26+00:00',0,0),(24,'entidad2@email.com','Entidad demandante','2','$2a$08$7wMFdwydbczuOdx1YfAChOgxYFlwB263vG/Gs0AKe1M171B75P.CO','','',2,'2018-03-21T18:38:52+00:00','2018-03-21T18:38:52+00:00',0,0),(26,'entidad3@email.com','Entidad demandante','3','$2a$08$VcSZ.r4DbPGMd3OQVSsF4OVprXjQuhLuaGBE03IcoriQmot905E2G','','',2,'2018-03-21T18:47:42+00:00','2018-03-21T18:47:42+00:00',0,0),(27,'entidad4@email.com','Entidad demandante','4','$2a$08$3rTtxpeJnFSxMmr8RqVmxO7MRHsb4.ZDDAOKcPAHx/i1LX2ZcUVqW','','',2,'2018-03-21T18:51:45+00:00','2018-03-21T18:51:45+00:00',0,0),(28,'profesor1@email.com','Profesor','1','$2a$08$ybZykJFYaLcyJa8DVsPv7ue.dEFbU4TpzxOAYjDnTrsyE6Vd45xna','','',3,'2018-03-22T09:52:57+00:00','2018-03-22T09:52:57+00:00',1,0),(29,'profesor2@email.com','Profesor','2','$2a$08$enLebY.ZbyXAgYVPCiJRB.lXiw6oDZ9aAdbuO8Za4ds92U2Ru3WcK','','',3,'2018-03-22T10:00:49+00:00','2018-03-22T10:00:49+00:00',1,0),(30,'profesor3@email.com','Profesor','3','$2a$08$pzmS9KXFrTuCmfpuqLmQIOWJlWtxpzeRd4dhVCGlln6kEsejh8gNm','','',3,'2018-03-22T10:01:23+00:00','2018-03-22T10:01:23+00:00',1,0),(31,'profesor4@email.com','Profesor','4','$2a$08$XLwfixim4zy67MRHSTylzeJBcl.V76TuR24aIwxxZLNYm2BUkNzOm','','',3,'2018-03-22T10:01:50+00:00','2018-03-22T10:01:50+00:00',1,0),(32,'universidad1@email.com','Universidad','1','$2a$08$hoDST0FSRrHsQYfzYtDp9.oxanpnNfz67BbHSWWhNi9YItSKOBj3q','','',4,'2018-03-22T10:02:17+00:00','2018-03-22T10:02:17+00:00',1,0),(33,'universidad2@email.com','Universidad','2','$2a$08$967PErhA4hyqAw1mP5164.xxrEJBcHQ4sqJiY6ZwhH6SIkiRxpy9u','','',4,'2018-03-22T10:02:47+00:00','2018-03-22T10:02:47+00:00',1,0),(34,'universidad3@email.com','Universidad','3','$2a$08$4yyfz5u/d.C/0jcdr7R1purVQuBaE4mTY41z1j1EkJAiZypDy1jRS','','',4,'2018-03-22T10:03:34+00:00','2018-03-22T10:03:34+00:00',1,0),(35,'universidad4@email.com','Universidad','4','$2a$08$ZqGASYdf0nxQlxM4ZMtodey7VQyuJce1rFXLsHqPYWarsHXjV0k9O','','',4,'2018-03-22T10:04:12+00:00','2018-03-22T10:04:12+00:00',1,0),(36,'universidad5@email.com','Universidad','5','$2a$08$3X5yjkVtI/WCWEXPIP8EYeG/isXLUQBozlAq5yQatQwSASygi8ufS','','',4,'2018-03-22T10:04:46+00:00','2018-03-22T10:04:46+00:00',1,0),(37,'profesor5@email.com','Profesor','5','$2a$08$w.U66XgsytcFIdQJdYP.yOLygz0LjUFpHg3iUht4hw94W7SmBTdrS','','',3,'2018-03-22T10:05:21+00:00','2018-03-22T10:05:21+00:00',1,0),(38,'entidad5@email.com','Entidad demandante','5','$2a$08$dZsKbLyKQVGPx5m5JuYdlOU7EYi3B3WYj4/sBu8uKuxXRkSj81eHC','','',2,'2018-03-22T10:06:36+00:00','2018-03-22T10:06:36+00:00',0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'yr3yzb75mbcq6uyw'
--

--
-- Dumping routines for database 'yr3yzb75mbcq6uyw'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-11 13:50:54
