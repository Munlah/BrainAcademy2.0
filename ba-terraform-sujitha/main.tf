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

resource "azurerm_resource_group" "BrainAcademy" {
  name     = "BrainAcademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "dvopsAKSCluster" {
  name                = "dvopsAKSCluster"
  location            = azurerm_resource_group.BrainAcademy.location
  resource_group_name = azurerm_resource_group.BrainAcademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "9bacd253-803f-4bc0-8784-86df59b28610"
    client_secret = "oxj8Q~FNSFVcIzwHxKLy3y9sG.BbROD_LDZJJbKc"
  }
}