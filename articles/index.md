---
layout: post
bodyclass: page-articles
---

{% for post in site.posts %}
  <article>
    <a href="{{ post.url }}">
      <h1>{{ post.title }}</h1>
      <p>{{ post.excerpt }}</p>
    </a>
  </article>
{% endfor %}