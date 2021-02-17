# Vi kan skrive kommentarer vha. hashtag
a <- 2 #kan jeg skrive noget jeg huske
b <- 7
c <- a+b
d <- a*b
#slet environment de variable der er indlæst med (pas på der er ingen advarsel)
rm(list = ls())
rm(b)
#ryd console men historik er der stadig ctrl+l

# Vi kan hente en fil med peg og klik i import dataset
library(readxl)
titanic <- read_excel("~/Dropbox/Datasets/titanic.xls")
#se fil 
View(titanic)
#PAKKER
#INSTALLER PAKKE til højre nederst under packages
install.packages("pacman")
#LOAD PAKKE
library("pacman")

#Fast punkt i filer til at hente pakker:
if (!require("pacman")) install.packages("pacman")
pacman::p_load(rio,ggplot2,"randomNames","pivottabler") #load various packages

options(scipen=999) #disable scientific