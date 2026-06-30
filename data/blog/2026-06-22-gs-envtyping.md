# Paper notes: Genomic selection meets environmental typing

*This is a sample post - replace it with your own weekly read. Edit the markdown
file directly in `data/blog/` and update the entry in `data/blog/posts.json`.*

## The big idea

Classic **genomic selection (GS)** predicts a plant's performance from its DNA.
It works well - but a genotype that wins in one place can lose in another because
of **genotype-by-environment interaction (G×E)**.

**Environmental typing** (e.g., the `EnvRtype` framework) tackles this by turning
weather and soil data into quantitative **environmental covariates** - temperature,
radiation, vapour-pressure deficit, growing-degree days, and more. Feed those into
the prediction model and you can start to forecast performance *across environments*,
not just within one.

## Why I find it exciting

- It connects the **field** (drones, sensors, weather stations) to the **model**.
- It makes predictions more **transferable** - useful for real breeding decisions.
- The covariates are interpretable, so breeders can reason about *why* a line does well.

## A simple mental model

```
Genomic markers  ─┐
                  ├─►  Prediction model  ─►  Performance across environments
Env. covariates  ─┘
```

## What I'm trying next

I'm experimenting with deriving environmental covariates from free APIs
(Open-Meteo, NASA POWER) and feeding them into a GS pipeline. If it works, I'll
share the code here.

**Takeaway:** genetics tells you *what* a plant can do; environment tells you
*where* it can do it. You need both.

- Swas
