import javascript

from PackageJSON pkgj
select pkgj.getFile(), pkgj.getPropValue("exports")
