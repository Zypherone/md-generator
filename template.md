# {{ title }}
{{ description}}

#### Table of Contents
{{#each contents}}
- [{{this.title}}](#{{this.title}})
{{/each}}

---
{{#each contents}}

## {{this.title}}
{{#with this.data}}
{{{this}}}
{{/with}} 
{{#with this.license}}
| Details | Author |
|---|---|
|This project is licensed under the {{name}} - see [choosealicense.com]({{html_url}}) for more details.<br />{{desc}}<br />[![License](https://img.shields.io/badge/License-{{badge}}-blue.svg)]({{html_url}}) © [{{../../user.username}}]({{../../user.email}})|<img src="{{../../user.avatar}}" width="250">
{{/with}}
{{/each}}