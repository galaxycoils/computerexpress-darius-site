import { defineComponent, createLibrary } from "@openuidev/react-lang";
import { TextContent, Card } from "@openuidev/react-ui";
import { z } from "zod";

// Minimal custom component for St. Catharines Digital
const ServiceCard = defineComponent({
  name: "ServiceCard",
  props: z.object({
    title: z.string(),
    description: z.string(),
  }),
  description: "A card showcasing a web design or SEO service",
  component: ({ props }) => (
    <Card>
      <TextContent>{props.title}</TextContent>
      <TextContent>{props.description}</TextContent>
    </Card>
  ),
});

// Testimonial
const Testimonial = defineComponent({
  name: "Testimonial",
  props: z.object({
    quote: z.string(),
  }),
  description: "A client testimonial",
  component: ({ props }) => (
    <Card>
      <TextContent>{props.quote}</TextContent>
    </Card>
  ),
});

// Create the library with minimal components
export const library = createLibrary({
  components: [
    ServiceCard,
    Testimonial
  ]
});

export const systemPrompt = "You are the AI assistant for St. Catharines Digital.";
