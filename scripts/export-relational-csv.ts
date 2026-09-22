import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { brands } from "../src/data/brands";
import { categories } from "../src/data/categories";
import { consumables } from "../src/data/consumables";
import { modelImages } from "../src/data/modelImages";
import { models } from "../src/data/models";
import type { PurchaseLinkData, SourceReference } from "../src/types";

const outputDirectory = path.resolve("data/catalog");

const csvCell = (value: unknown): string => {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const csv = (headers: string[], rows: unknown[][]): string =>
  `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;

const sourceId = (source: SourceReference): string =>
  `source-${createHash("sha256")
    .update([source.title, source.url, source.sourceType, source.checkedAt].join("\u0000"))
    .digest("hex")
    .slice(0, 16)}`;

const sourceById = new Map<string, SourceReference>();
const entitySources: unknown[][] = [];
const registerSources = (
  entityType: "model" | "consumable" | "product-option",
  entityId: string,
  sources: SourceReference[],
  purpose: string,
) => {
  for (const source of sources) {
    const id = sourceId(source);
    sourceById.set(id, source);
    entitySources.push([entityType, entityId, id, purpose]);
  }
};

for (const model of models) registerSources("model", model.id, model.sources, "model-verification");
for (const part of consumables) {
  registerSources("consumable", part.id, part.sources, "compatibility-verification");
  for (const option of part.productOptions) {
    registerSources("product-option", option.id, option.sources, "product-option-verification");
  }
}

const purchaseLinkRows = new Map<string, unknown[]>();
const appendPurchaseLinks = (
  consumableId: string,
  productOptionId: string,
  links: PurchaseLinkData[],
) => {
  for (const link of links) {
    const existing = purchaseLinkRows.get(link.id);
    if (existing) {
      const existingOptionId = String(existing[2] ?? "");
      if (productOptionId && existingOptionId && existingOptionId !== productOptionId) {
        throw new Error(`Purchase link is assigned to multiple product options: ${link.id}`);
      }
      if (productOptionId && !existingOptionId) existing[2] = productOptionId;
      continue;
    }
    purchaseLinkRows.set(link.id, [
      link.id,
      consumableId,
      productOptionId,
      link.label,
      link.url,
      link.channel,
      link.linkType,
      link.isAffiliate,
      link.checkedAt,
      true,
    ]);
  }
};

for (const part of consumables) {
  appendPurchaseLinks(part.id, "", part.purchaseLinks);
  for (const option of part.productOptions) {
    appendPurchaseLinks(part.id, option.id, option.purchaseLinks);
  }
}

const files = new Map<string, string>([
  [
    "categories.csv",
    csv(
      [
        "id",
        "slug",
        "label",
        "symbol",
        "selectorImage",
        "description",
        "metaDescription",
        "modelNumberGuide",
        "partTypes",
        "sortOrder",
        "isActive",
      ],
      categories.map((category, index) => [
        category.id,
        category.id,
        category.label,
        category.symbol,
        category.selectorImage,
        category.description,
        category.metaDescription,
        category.modelNumberGuide,
        category.partTypes.join("|"),
        index,
        true,
      ]),
    ),
  ],
  [
    "brands.csv",
    csv(
      [
        "id",
        "slug",
        "name",
        "nameEn",
        "supportedCategories",
        "officialDomains",
        "sortOrder",
        "isActive",
      ],
      brands.map((brand, index) => [
        brand.id,
        brand.slug,
        brand.name,
        brand.nameEn,
        brand.supportedCategories.join("|"),
        brand.officialDomains.join("|"),
        index,
        true,
      ]),
    ),
  ],
  [
    "consumables.csv",
    csv(
      [
        "id",
        "slug",
        "type",
        "displayName",
        "genuinePartNumber",
        "partNumberStatus",
        "compatibleProductName",
        "searchKeywords",
        "replacementInterval",
        "purchaseWarning",
        "verificationStatus",
        "affiliateSearchKeyword",
        "affiliateDirectUrl",
        "affiliateIsAffiliate",
        "affiliateRestrictionNote",
        "affiliateEnabled",
        "affiliateStatus",
        "affiliatePriceStatus",
        "affiliateStockStatus",
        "affiliateLinkCheckedAt",
        "sortOrder",
      ],
      consumables.map((part, index) => [
        part.id,
        part.slug,
        part.type,
        part.displayName,
        part.genuinePartNumber,
        part.partNumberStatus,
        part.compatibleProductName,
        part.searchKeywords.join("|"),
        part.replacementInterval,
        part.purchaseWarning,
        part.verificationStatus,
        part.affiliate.searchKeyword,
        part.affiliate.directUrl,
        part.affiliate.isAffiliate,
        part.affiliate.restrictionNote,
        part.affiliate.enabled,
        part.affiliate.status,
        part.affiliate.priceStatus,
        part.affiliate.stockStatus,
        part.affiliate.linkCheckedAt,
        index,
      ]),
    ),
  ],
  [
    "model-consumables.csv",
    csv(
      ["modelId", "consumableId", "verificationStatus", "verifiedAt", "note"],
      models.flatMap((model) =>
        model.consumableIds.map((consumableId) => {
          const part = consumables.find(({ id }) => id === consumableId);
          if (!part) throw new Error(`Missing consumable: ${consumableId}`);
          return [
            model.id,
            consumableId,
            part.verificationStatus,
            part.sources[0]?.checkedAt ?? "",
            "",
          ];
        }),
      ),
    ),
  ],
  [
    "sources.csv",
    csv(
      ["id", "title", "url", "sourceType", "checkedAt", "isActive"],
      [...sourceById.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([id, source]) => [
          id,
          source.title,
          source.url,
          source.sourceType,
          source.checkedAt,
          true,
        ]),
    ),
  ],
  [
    "entity-sources.csv",
    csv(
      ["entityType", "entityId", "sourceId", "purpose"],
      entitySources.sort((left, right) => String(left[1]).localeCompare(String(right[1]))),
    ),
  ],
  [
    "product-options.csv",
    csv(
      [
        "id",
        "consumableId",
        "name",
        "kind",
        "verification",
        "description",
        "partNumber",
        "packageLabel",
        "sortOrder",
        "isActive",
      ],
      consumables.flatMap((part) =>
        part.productOptions.map((option, index) => [
          option.id,
          part.id,
          option.name,
          option.kind,
          option.verification,
          option.description,
          option.partNumber,
          option.packageLabel,
          index,
          true,
        ]),
      ),
    ),
  ],
  [
    "purchase-links.csv",
    csv(
      [
        "id",
        "consumableId",
        "productOptionId",
        "label",
        "url",
        "channel",
        "linkType",
        "isAffiliate",
        "checkedAt",
        "isActive",
      ],
      [...purchaseLinkRows.values()],
    ),
  ],
  [
    "images.csv",
    csv(
      ["id", "modelId", "src", "alt", "sourceUrl", "checkedAt", "sortOrder", "isPrimary"],
      Object.entries(modelImages).map(([modelId, image]) => [
        `${modelId}-primary`,
        modelId,
        image.src,
        image.alt,
        image.sourceUrl,
        image.checkedAt,
        0,
        true,
      ]),
    ),
  ],
]);

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  [...files].map(([name, content]) => writeFile(path.join(outputDirectory, name), content, "utf8")),
);

console.log(
  `관계형 CSV 생성 완료: ${files.size}개 파일, 모델 ${models.length}, 소모품 ${consumables.length}, 호환 관계 ${consumables.reduce((sum, part) => sum + part.compatibleModelIds.length, 0)}`,
);
