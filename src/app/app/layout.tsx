import { AppGuard } from '@/components/AppGuard'
export default function Layout({children}:{children:React.ReactNode}) { return <AppGuard>{children}</AppGuard> }
