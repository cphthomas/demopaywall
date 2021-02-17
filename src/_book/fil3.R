#hent og importer ejendomsdata datasæt
#attach
attach(Ejendomsdata)
chitest <- chisq.test(Boligtype,Ejendomsrisiko)
chitest$observed #antal observerede
chitest$statistic #teststørrelse
chitest$parameter #df
chitest$expected
chitest$residuals #forskel mellem observeret
(chitest$residuals)^2 #cellebidrag
sum((chitest$residuals)^2)
chitest$p.value
