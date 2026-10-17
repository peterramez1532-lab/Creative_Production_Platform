import type { Metadata } from 'next';import './globals.css';
export const metadata:Metadata={title:'Frameflow — Creative Production',description:'A production workspace for creative teams, talent and clients.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
