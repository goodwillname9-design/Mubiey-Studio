import {createClient} from '@supabase/supabase-js';
import {requireEnvironment} from './config.js';
let client;
export function storage(){const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY}=requireEnvironment();client??=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});return client.storage.from('mubiey-private')}
export function bucket(){const b=storage();return{async list(){const {data,error}=await b.list('',{limit:1});if(error)throw error;return data},async delete(key){const {error}=await b.remove([key]);if(error)throw error},async signed(key,download){const {data,error}=await b.createSignedUrl(key,60,download?{download}:{});if(error)throw error;return data.signedUrl},async signUpload(key){const {data,error}=await b.createSignedUploadUrl(key,{upsert:false});if(error)throw error;return data.signedUrl},async info(key){const {data,error}=await b.info(key);if(error)throw error;return data}}}
