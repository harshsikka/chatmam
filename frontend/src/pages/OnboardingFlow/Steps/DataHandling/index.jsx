import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import PineconeLogo from "@/media/vectordbs/pinecone.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import WeaviateLogo from "@/media/vectordbs/weaviate.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";
import MilvusLogo from "@/media/vectordbs/milvus.png";
import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";

const TITLE = "Data Handling & Privacy";
const DESCRIPTION =
  "We are committed to transparency and control when it comes to your personal data.";
const LLM_SELECTION_PRIVACY = {
  openai: {
    name: "OpenAI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to OpenAI",
    ],
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    description: [
      "Your chats will not be used for training",
      "Your text and embedding text are not visible to OpenAI or Microsoft",
    ],
    logo: AzureOpenAiLogo,
  },
  anthropic: {
    name: "Anthropic",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to Anthropic",
    ],
    logo: AnthropicLogo,
  },
  gemini: {
    name: "Google Gemini",
    description: [
      "Your chats are de-identified and used in training",
      "Your prompts and document text used in response creation are visible to Google",
    ],
    logo: GeminiLogo,
  },
  lmstudio: {
    name: "LMStudio",
    description: [
      "Your model and chats are only accessible on the server running LMStudio",
    ],
    logo: LMStudioLogo,
  },
  localai: {
    name: "LocalAI",
    description: [
      "Your model and chats are only accessible on the server running LocalAI",
    ],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "Your model and chats are only accessible on the machine running Ollama models",
    ],
    logo: OllamaLogo,
  },
  native: {
    name: "Custom Llama Model",
    description: [
      "Your model and chats are only accessible on this AnythingLLM instance",
    ],
    logo: AnythingLLMIcon,
  },
  togetherai: {
    name: "TogetherAI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to TogetherAI",
    ],
    logo: TogetherAILogo,
  },
  mistral: {
    name: "Mistral",
    description: [
      "Your prompts and document text used in response creation are visible to Mistral",
    ],
    logo: MistralLogo,
  }
};

const VECTOR_DB_PRIVACY = {
  chroma: {
    name: "Chroma",
    description: [
      "Your vectors and document text are stored on your Chroma instance",
      "Access to your instance is managed by you",
    ],
    logo: ChromaLogo,
  },
  pinecone: {
    name: "Pinecone",
    description: [
      "Your vectors and document text are stored on Pinecone's servers",
      "Access to your data is managed by Pinecone",
    ],
    logo: PineconeLogo,
  },
  qdrant: {
    name: "Qdrant",
    description: [
      "Your vectors and document text are stored on your Qdrant instance (cloud or self-hosted)",
    ],
    logo: QDrantLogo,
  },
  weaviate: {
    name: "Weaviate",
    description: [
      "Your vectors and document text are stored on your Weaviate instance (cloud or self-hosted)",
    ],
    logo: WeaviateLogo,
  },
  milvus: {
    name: "Milvus",
    description: [
      "Your vectors and document text are stored on your Milvus instance (cloud or self-hosted)",
    ],
    logo: MilvusLogo,
  },
  lancedb: {
    name: "LanceDB",
    description: [
      "Your vectors and document text are stored privately on this instance of AnythingLLM",
    ],
    logo: LanceDbLogo,
  },
};

const EMBEDDING_ENGINE_PRIVACY = {
  native: {
    name: "AnythingLLM Embedder",
    description: [
      "Your document text is embedded privately on this instance of AnythingLLM",
    ],
    logo: AnythingLLMIcon,
  },
  openai: {
    name: "OpenAI",
    description: [
      "Your document text is sent to OpenAI servers",
      "Your documents are not used for training",
    ],
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    description: [
      "Your document text is sent to your Microsoft Azure service",
      "Your documents are not used for training",
    ],
    logo: AzureOpenAiLogo,
  },
  localai: {
    name: "LocalAI",
    description: [
      "Your document text is embedded privately on the server running LocalAI",
    ],
    logo: LocalAiLogo,
  },
};

export default function DataHandling({ setHeader, setForwardBtn, setBackBtn }) {
  const [llmChoice, setLLMChoice] = useState("openai");
  const [loading, setLoading] = useState(true);
  const [vectorDb, setVectorDb] = useState("pinecone");
  const [embeddingEngine, setEmbeddingEngine] = useState("openai");
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });
    async function fetchKeys() {
      const _settings = await System.keys();
      setLLMChoice(_settings?.LLMProvider || "openai");
      setVectorDb(_settings?.VectorDB || "pinecone");
      setEmbeddingEngine(_settings?.EmbeddingEngine || "openai");

      setLoading(false);
    }
    fetchKeys();
  }, []);

  function handleForward() {
    navigate(paths.onboarding.survey());
  }

  function handleBack() {
    navigate(paths.onboarding.userSetup());
  }

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">LLM Selection</div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLM_SELECTION_PRIVACY[llmChoice].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {LLM_SELECTION_PRIVACY[llmChoice].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {LLM_SELECTION_PRIVACY[llmChoice].description.map((desc) => (
              <li className="text-white/90 text-sm">{desc}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">Embedding Engine</div>
          <div className="flex items-center gap-2.5">
            <img
              src={EMBEDDING_ENGINE_PRIVACY[embeddingEngine].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {EMBEDDING_ENGINE_PRIVACY[embeddingEngine].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {EMBEDDING_ENGINE_PRIVACY[embeddingEngine].description.map(
              (desc) => (
                <li className="text-white/90 text-sm">{desc}</li>
              )
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4">
          <div className="text-white text-base font-bold">Vector Database</div>
          <div className="flex items-center gap-2.5">
            <img
              src={VECTOR_DB_PRIVACY[vectorDb].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {VECTOR_DB_PRIVACY[vectorDb].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {VECTOR_DB_PRIVACY[vectorDb].description.map((desc) => (
              <li className="text-white/90 text-sm">{desc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
