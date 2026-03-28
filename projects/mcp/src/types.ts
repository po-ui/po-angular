export interface ComponentProperty {
  name: string;
  alias: string;
  type: string;
  description: string;
  required: boolean;
  default?: string;
  deprecated?: string;
  optional: boolean;
}

export interface ComponentEvent {
  name: string;
  alias: string;
  description: string;
}

export interface CssToken {
  property: string;
  description: string;
  defaultValue: string;
  category: string;
}

export interface ComponentSample {
  name: string;
  title: string;
  files: Array<{ name: string; content: string }>;
}

export interface ComponentDoc {
  name: string;
  selector: string;
  description: string;
  library: string;
  category: string;
  properties: ComponentProperty[];
  events: ComponentEvent[];
  cssTokens: CssToken[];
  samples: ComponentSample[];
  methods: ComponentMethod[];
}

export interface ComponentMethod {
  name: string;
  description: string;
  isPublic: boolean;
}

export interface GuideDoc {
  name: string;
  label: string;
  fileName: string;
  content: string;
}

export interface ParsedRepo {
  components: ComponentDoc[];
  guides: GuideDoc[];
}
