import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generatePublicSiteId } from "../src/utils/site.js";

const prisma = new PrismaClient();

async function main() {
  const email = "gggum999@gmail.com";
  const legacyEmail = "owner@adstream.local";
  const passwordHash = await bcrypt.hash("Lee50925092@", 10);

  const user = await prisma.$transaction(async (tx) => {
    const currentUser = await tx.user.findUnique({
      where: { email }
    });

    if (currentUser) {
      return tx.user.update({
        where: { id: currentUser.id },
        data: {
          email,
          passwordHash
        }
      });
    }

    const legacyUser = await tx.user.findUnique({
      where: { email: legacyEmail }
    });

    if (legacyUser) {
      return tx.user.update({
        where: { id: legacyUser.id },
        data: {
          email,
          passwordHash
        }
      });
    }

    return tx.user.create({
      data: {
        email,
        passwordHash
      }
    });
  });

  const site = await prisma.site.upsert({
    where: { publicSiteId: "site_demo_adstream" },
    update: {},
    create: {
      userId: user.id,
      name: "Demo Academy",
      domain: "demo.adstream.local",
      description: "AdStream demo publisher site",
      publicSiteId: "site_demo_adstream",
      revenueSharePercentForPublisher: 70,
      adstreamFeePercent: 30
    }
  });

  const existingAdCount = await prisma.ad.count();
  if (existingAdCount === 0) {
    await prisma.ad.createMany({
      data: [
        {
          title: "AdStream으로 영상 수익화 시작하기",
          imageUrl: "https://dummyimage.com/640x360/111827/ffffff&text=AdStream+Launch",
          clickUrl: "https://example.com/adstream-launch",
          isActive: true,
          startAt: new Date(Date.now() - 86400000),
          endAt: new Date(Date.now() + 86400000 * 365),
          targetType: "all"
        },
        {
          title: "교육 플랫폼 전용 광고 템플릿",
          imageUrl: "https://dummyimage.com/640x360/0f766e/ffffff&text=Education+Ads",
          clickUrl: "https://example.com/education-ads",
          isActive: true,
          startAt: new Date(Date.now() - 86400000),
          endAt: new Date(Date.now() + 86400000 * 365),
          targetType: "all"
        }
      ]
    });
  }

  const introSite = await prisma.site.findFirst({
    where: { id: site.id }
  });

  if (!introSite) {
    throw new Error("Failed to create demo site");
  }

  console.log("Seeded user:", email);
  console.log("Seeded siteId:", introSite.publicSiteId);
  console.log("Generated example siteId:", generatePublicSiteId());
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
