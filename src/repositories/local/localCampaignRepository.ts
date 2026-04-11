import type { Campaign } from "@/domain/types";
import type { CampaignRepository } from "@/repositories/contracts";
import { getBrowserStorage, isRecord, readJsonStorage, writeJsonStorage } from "@/lib/storage";

const STORAGE_KEY = "fcq.campaigns";

function isCampaign(value: unknown): value is Campaign {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.entryPath === "string" &&
    (value.entryPath === "self-serve" || value.entryPath === "school-issued") &&
    typeof value.active === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (value.counselorId === undefined || typeof value.counselorId === "string")
  );
}

function isCampaignRecord(value: unknown): value is Record<string, Campaign> {
  return isRecord(value) && Object.entries(value).every(([id, campaign]) => isCampaign(campaign) && campaign.id === id);
}

export function createLocalCampaignRepository(storage = getBrowserStorage()): CampaignRepository {
  const loadCampaigns = () => readJsonStorage<Record<string, Campaign>>(storage, STORAGE_KEY, {}, isCampaignRecord);
  const persistCampaigns = (campaigns: Record<string, Campaign>) => writeJsonStorage(storage, STORAGE_KEY, campaigns);

  return {
    listCampaigns: () => Object.values(loadCampaigns()),
    getCampaign: (id) => loadCampaigns()[id] ?? null,
    saveCampaign: (campaign) => {
      const campaigns = loadCampaigns();
      campaigns[campaign.id] = campaign;
      persistCampaigns(campaigns);
      return campaign;
    },
  };
}
