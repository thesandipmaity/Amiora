import { redirect } from 'next/navigation'

// /products → redirects to /shop (our main shop page)
export default function ProductsPage() {
  redirect('/shop')
}
