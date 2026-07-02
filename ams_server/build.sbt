name := """ams_server"""
organization := "com.example"

version := "1.0-SNAPSHOT"

//lazy val root = (project in file(".")).enablePlugins(PlayJava)
lazy val root = (project in file("."))
  .enablePlugins(PlayJava, PlayEbean)

scalaVersion := "2.13.18"

libraryDependencies ++= Seq(
  guice,
  jdbc,
  filters,
  "com.mysql" % "mysql-connector-j" % "9.3.0",
  "org.mindrot" % "jbcrypt" % "0.4",
  "io.jsonwebtoken" % "jjwt-api" % "0.11.5",
  "io.jsonwebtoken" % "jjwt-impl" % "0.11.5",
  "io.jsonwebtoken" % "jjwt-jackson" % "0.11.5"
)
