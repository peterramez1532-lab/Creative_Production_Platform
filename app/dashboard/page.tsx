import {redirect} from 'next/navigation';import {getUser} from '@/lib/auth';import Dashboard from '@/components/dashboard';
export const dynamic='force-dynamic';
export default async function DashboardPage(){const user=await getUser();if(!user)redirect('/login');return <Dashboard user={{id:user.id,name:user.name,email:user.email,role:user.role}}/>}
