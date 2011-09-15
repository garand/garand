---
layout: index
shortname: index
---

{% for post in site.posts limit: 1 %}
  <article>
    <h1>{{ post.title }}</h1>
    {{ post.content }}
  </article>
{% endfor %}