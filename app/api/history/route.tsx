// import {NextResponse} from 'next/server';
// import {db} from '../../../configs/db';
// import {HistoryTable} from '../../../configs/schema';
// import {currentUser} from '@clerk/nextjs/server'
// import { eq } from 'drizzle-orm';

// export async function POST(request:any) {
//     const {content,recordId,aiAgentType} = await request.json();
//     const user = await currentUser();
//     try {
//         if (!user?.primaryEmailAddress?.emailAddress) {
//             return NextResponse.json({ error: 'User email is required' }, { status: 400 });
//         }
//         const result = await db.insert(HistoryTable).values({
//             recordId: recordId,
//             content: content,
//             userEmail: user.primaryEmailAddress.emailAddress,
//             createdAt : (new Date()).toString(),
//             aiAgentType : aiAgentType
//         })
//         return NextResponse.json(result)
//     }catch(e){
//         return NextResponse.json(e)
//     }
// }

// export async function PUT(req : any){
//     const {content,recordId} = await req.json();
//     try {
//         const result = await db.update(HistoryTable).set({
//             content: content,
//         }).where(eq(HistoryTable.recordId, recordId))
//         return NextResponse.json(result)
//     }catch(e){
//         return NextResponse.json(e)
//     }
// }

// export async function GET(req:any) {
//     const {searchParams} = new URL(req.url);
//     const recordId = searchParams.get('recordId');
//     const user = await currentUser();
//     try {
//         if(recordId){
//             const result = await db.select().from(HistoryTable).where(eq(HistoryTable.recordId, recordId));
//             return NextResponse.json(result[0])
//         }
//         else{
//             // @ts-ignore
//             const result = await db.select().from(HistoryTable).where(eq(HistoryTable.userEmail, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(HistoryTable.id));
//             return NextResponse.json(result)
//         }
//         return NextResponse.json({})
//     }catch(e){
//         return NextResponse.json(e)
//     }
// }


import {NextResponse} from 'next/server';
import {db} from '../../../configs/db';
import {HistoryTable} from '../../../configs/schema';
import {currentUser} from '@clerk/nextjs/server'
import { eq, desc } from 'drizzle-orm';

export async function POST(request:any) {
    const {content,recordId,aiAgentType} = await request.json();
    const user = await currentUser();
    try {
        if (!user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: 'User email is required' }, { status: 400 });
        }
        const result = await db.insert(HistoryTable).values({
            recordId: recordId,
            content: content,
            userEmail: user.primaryEmailAddress.emailAddress,
            createdAt : (new Date()).toString(),
            aiAgentType : aiAgentType
        })
        return NextResponse.json(result)
    }catch(e){
        return NextResponse.json(e)
    }
}

export async function PUT(req : any){
    const {content,recordId} = await req.json();
    try {
        const result = await db.update(HistoryTable).set({
            content: content,
        }).where(eq(HistoryTable.recordId, recordId))
        return NextResponse.json(result)
    }catch(e){
        return NextResponse.json(e)
    }
}

export async function GET(req: any) {
    try {
        const { searchParams } = new URL(req.url);
        const recordId = searchParams.get('recordId');
        const user = await currentUser();

        if (!user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
        }

        if (recordId) {
            console.log('Fetching history for recordId:', recordId);
            const result = await db.select()
                .from(HistoryTable)
                .where(eq(HistoryTable.recordId, recordId));
            
            if (!result || result.length === 0) {
                return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            }
            
            return NextResponse.json(result[0]);
        } else {
            const result = await db.select()
                .from(HistoryTable)
                .where(eq(HistoryTable.userEmail, user.primaryEmailAddress.emailAddress))
                .orderBy(desc(HistoryTable.id));
            
            return NextResponse.json(result || []);
        }
    } catch (e) {
        console.error('Detailed History API Error:', e);
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            details: e instanceof Error ? e.message : String(e) 
        }, { status: 500 });
    }
}