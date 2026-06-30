import { randomUUID } from "crypto";

export type VideoJobRecord = {
  id: string;
  status: "pending" | "processing" | "done" | "failed" | "expired";
  videoUrl?: string;
  error?: string;
  createdAt: number;
};

const jobs = new Map<string, VideoJobRecord>();
const TTL_MS = 24 * 60 * 60 * 1000;

export function createVideoJob(): string {
  const id = randomUUID();
  jobs.set(id, {
    id,
    status: "pending",
    createdAt: Date.now(),
  });
  return id;
}

export function setVideoJobProcessing(id: string) {
  const j = jobs.get(id);
  if (j) j.status = "processing";
}

export function completeVideoJob(id: string, videoUrl: string) {
  jobs.set(id, {
    id,
    status: "done",
    videoUrl,
    createdAt: jobs.get(id)?.createdAt ?? Date.now(),
  });
}

export function failVideoJob(id: string, error: string) {
  const j = jobs.get(id);
  jobs.set(id, {
    id,
    status: "failed",
    error,
    createdAt: j?.createdAt ?? Date.now(),
  });
}

export function getVideoJob(id: string): VideoJobRecord | undefined {
  const j = jobs.get(id);
  if (!j) return undefined;
  if (Date.now() - j.createdAt > TTL_MS) {
    jobs.set(id, { ...j, status: "expired" });
    return jobs.get(id);
  }
  return j;
}