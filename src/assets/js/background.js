import storage from '@/utils/storage/index'
const colors = [
  'linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)',
  'linear-gradient(to right, #ee9ca7, #ffdde1)',
  'linear-gradient(to right, #4b79a1, #283e51)',
  'linear-gradient(to right, #ad5389, #3c1053)',
  'linear-gradient(to right, #22c1c3, #fdbb2d)',
  'linear-gradient(to right, #a8c0ff, #3f2b96)',
  'linear-gradient(to right, #005c97, #363795)',
  'linear-gradient(to right, #f12711, #f5af19)',
  'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
  'linear-gradient(to right, #fc00ff, #00dbde)'
]

export const defaultColors = colors.map(item => {
  return {
    background: item
  }
})
export function getRandowColor () {
  const index = Math.floor(Math.random() * 10)
  if (storage.get('theme')) {
    return storage.get('theme')
  } else {
    return colors[index]
  }
}
