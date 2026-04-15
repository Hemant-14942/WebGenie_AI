import { Website } from "../models/website.model.js";
import {
  generateWebsite,
  generateWebsiteUpdate,
} from "../config/openRouter.js";
import { Request, Response } from "express";
import { Request as CustomRequest } from "../types/http.js";
import { User } from "../models/user.model.js";
import { CREDIT_COST } from "../constants/masterPrompt.js";
import {
  parseWebsiteResponse,
  type WebsiteLlmResponse,
} from "../services/websiteBuilder.service.js";


export const demo = async (req: Request, res: Response) => {
  try {
    const response = await generateWebsite("hello world");
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const buildWebsite = async (req: CustomRequest, res: Response) => {
  console.log("inside buildWebsite");
  try {
    const { prompt } = req.body;
    console.log("got the prompt");
    
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    const user = await User.findById(req.user?.id);
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("user credits", user.credits);
    if (user.credits < CREDIT_COST) {
      return res.status(400).json({ message: "Insufficient credits" });
    }
    const MAX_ATTEMPTS = 3;
    let parsed: WebsiteLlmResponse | null = null;

    console.log("going for api call to generate website");

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const raw = await generateWebsite(prompt);
      console.log("in the loop of api call to generate website-->", attempt);

      try {
        parsed = parseWebsiteResponse(raw);
      } catch {
        parsed = null;
      }

      if (parsed) break;

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 300));
      }

      if (attempt === MAX_ATTEMPTS) {
        return res.status(500).json({ message: "LLM returned invalid JSON" });
      }
    }

    if (!parsed) {
      return res.status(500).json({ message: "LLM returned invalid JSON" });
    }

    const aiMessage =
      typeof parsed?.message === "string" && parsed.message.trim().length > 0
        ? parsed.message
        : "Website generated successfully.";

console.log("going fro saving the website");

    const website = await Website.create({
      userId: user._id,
      title: prompt.slice(0, 60).trim(),
      code: parsed.code,
      deployed: false,
      conversation: [
        { role: "user", content: prompt },
        { role: "ai", content: aiMessage },
      ],
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { credits: -CREDIT_COST } },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update credits" });
    }
    console.log("sending the response to the client");
    res.status(200).json({
      message: "Website created successfully",
      websiteId: website._id.toString(),
      code: parsed.code,
      aiMessage: aiMessage,
      credits: updatedUser.credits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWebsite = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    if (website.userId.toString() !== req.user?.id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this website" });
    }
    res.status(200).json({ website });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWebsiteChat = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!id) {
      return res.status(400).json({ message: "Website ID is required" });
    }
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.credits < CREDIT_COST) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    if (website?.userId.toString() !== req.user?.id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this website" });
    }

    const prevcode = website.code;
    const MAX_ATTEMPTS = 3;
    let parsed: WebsiteLlmResponse | null = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const raw = await generateWebsiteUpdate(prevcode, message);

      try {
        parsed = parseWebsiteResponse(raw);
      } catch {
        parsed = null;
      }
      if (parsed) {
        break;
      }
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 300));
      }
      if (attempt === MAX_ATTEMPTS) {
        return res.status(500).json({ message: "LLM returned invalid JSON" });
      }
    }
    if (!parsed) {
      return res.status(500).json({ message: "LLM returned invalid JSON" });
    }
    const aiMessage =
      typeof parsed?.message === "string" && parsed?.message.trim().length > 0
        ? parsed?.message
        : "Website updated successfully.";
    const updatedWebsite = await Website.findByIdAndUpdate(
      id,
      {
        code: parsed?.code,
        conversation: [
          ...website.conversation,
          { role: "user", content: message },
          { role: "ai", content: aiMessage },
        ],
      },
      { returnDocument: "after" },
    );
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { credits: -CREDIT_COST } },
      { returnDocument: "after" },
    );
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update credits" });
    }
    if (!updatedWebsite) {
      return res.status(500).json({ message: "Failed to update website" });
    }
    res
      .status(200)
      .json({
        message: "Website updated successfully",
        code: parsed?.code || "",
        aiMessage: aiMessage,
        credits: updatedUser.credits,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllWebsites = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const websites = await Website.find({ userId: user._id });
    if (!websites) {
      return res.status(404).json({ message: "No websites found" });
    }
    res
      .status(200)
      .json({ message: "Websites fetched successfully", data: websites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deployWebsite = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const website = await Website.findOne({
      _id: id,
      userId: req.user?.id,
    });
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    if (website.deployed && website.slug && website.deployedUrl) {
      return res.status(200).json({
        message: "Website already deployed",
        slug: website.slug,
        url: website.deployedUrl,
      });
    }
    const baseSlug = (website.title || "untitled")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const shortId = website._id.toString().slice(-6);
    const slug = `${baseSlug || "untitled"}-${shortId}`;

    const deploymentBase =
      process.env.DEPLOYMENT_URL || "http://localhost:3000/sites";

    const deploymentUrl = `${deploymentBase.replace(/\/$/, "")}/${slug}`;

    website.deployed = true;
    website.deployedUrl = deploymentUrl;
    website.slug = slug;
    await website.save();
    res
      .status(200)
      .json({
        message: "Website deployed successfully",
        url: deploymentUrl,
        slug,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to deploy website" });
  }
};

export const getDeployedWebsiteBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const website = await Website.findOne({
      slug,
      deployed: true,
      isActive: true,
    }).select("title code slug deployedUrl updatedAt");

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    return res.status(200).json({
      message: "Website fetched successfully",
      website,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};