const proj4Datas = [
  {
    code: '4547',
    proj4: '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs',
    name: 'CGCS2000 / 3-degree Gauss-Kruger CM 114E'
  },
  {
    code: '4550',
    proj4: '+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs',
    name: 'CGCS2000 / 3-degree Gauss-Kruger CM 123E'
  }
]


export const getProjData4ByCode = (code: string | number) => {
  const data = proj4Datas.find(item => {
    return item.code == code
  })
  return data
}