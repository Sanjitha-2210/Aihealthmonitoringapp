import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create singleton Supabase admin client
let adminClient: any = null;
function getAdminClient() {
  if (!adminClient) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
      throw new Error('Server configuration error: Missing Supabase credentials');
    }
    
    adminClient = createClient(supabaseUrl, serviceRoleKey);
  }
  return adminClient;
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8a2b1ce1/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "AI Health Monitor API is running"
  });
});

// Sign up endpoint
app.post("/make-server-8a2b1ce1/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Save vitals endpoint
app.post("/make-server-8a2b1ce1/vitals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const supabase = getAdminClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const vitalsData = await c.req.json();
    const timestamp = new Date().toISOString();
    const key = `vitals:${user.id}:${timestamp}`;
    
    await kv.set(key, {
      ...vitalsData,
      userId: user.id,
      timestamp
    });

    return c.json({ success: true, timestamp });
  } catch (error) {
    console.error('Error saving vitals:', error);
    return c.json({ error: 'Failed to save vitals' }, 500);
  }
});

// Get vitals history endpoint
app.get("/make-server-8a2b1ce1/vitals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const supabase = getAdminClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const prefix = `vitals:${user.id}:`;
    const vitalsRecords = await kv.getByPrefix(prefix);
    
    // Sort by timestamp descending (newest first)
    const sortedRecords = vitalsRecords.sort((a, b) => 
      new Date(b.value.timestamp).getTime() - new Date(a.value.timestamp).getTime()
    );

    return c.json({ vitals: sortedRecords.map(r => r.value) });
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return c.json({ error: 'Failed to fetch vitals' }, 500);
  }
});

// Delete vitals record endpoint
app.delete("/make-server-8a2b1ce1/vitals/:timestamp", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const supabase = getAdminClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const timestamp = c.req.param('timestamp');
    const key = `vitals:${user.id}:${timestamp}`;
    
    await kv.del(key);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting vitals:', error);
    return c.json({ error: 'Failed to delete vitals' }, 500);
  }
});

Deno.serve(app.fetch);