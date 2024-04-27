import json
import pprint
import subprocess
from typing import TypedDict


def bw(*args: str) -> dict:
    proc: subprocess.CompletedProcess[str] = subprocess.run(
        ["bw", *args], stdout=subprocess.PIPE, check=True, text=True
    )
    return json.loads(proc.stdout)


def gh_secret_set(name: str, value: str) -> None:
    subprocess.run(["gh", "secret", "set", name, "--body", value], check=True)


class Folder(TypedDict):
    id: str


class Item(TypedDict):
    name: str
    notes: str | None


item: Item = bw("get", "item", "UUID")  # pyright: ignore[reportAssignmentType]
uuid: str = item["notes"]  # pyright: ignore[reportAssignmentType]
folder: Folder = bw("get", "folder", "the Great Wall")  # pyright: ignore[reportAssignmentType]
items: list[Item] = bw("list", "items", "--folderid", folder["id"])  # pyright: ignore[reportAssignmentType]
urls: list[str] = [item["notes"] for item in items if item["notes"]]

print(uuid)
pprint.pprint(urls)

gh_secret_set("MY_UUID", uuid)
gh_secret_set("MY_SUB_URLS", "\n".join(urls))
