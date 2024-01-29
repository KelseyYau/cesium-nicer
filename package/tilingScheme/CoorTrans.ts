import gcoord from 'gcoord'

export function Gcj02ToWgs84(lng, lat) {
  return gcoord.transform([lng, lat], gcoord.WGS1984, gcoord.GCJ02)
}
