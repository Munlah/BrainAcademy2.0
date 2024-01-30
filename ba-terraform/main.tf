terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "brainacademy" {
  name     = "brainacademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "brainacademyAKSCluster" {
  name                = "brainacademyAKSCluster"
  location            = azurerm_resource_group.brainacademy.location
  resource_group_name = azurerm_resource_group.brainacademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "76e616bd-2322-47da-9706-934c22940e0a"
    client_secret = "0bo8Q~Onkv9mP-rJGsLP_E2nx-YJlC91Wsaaqai6"
  }
}